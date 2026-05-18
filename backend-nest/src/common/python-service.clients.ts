import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface ProcessorPayload {
  amount: number;
  currency: string;
  card_last_four: string;
  description?: string;
}

export interface ProcessorResponse {
  approved: boolean;
  reference: string;
  timestamp: string;
  rejection_reason?: string;
  processor_message: string;
}

@Injectable()
export class PythonServiceClient {
  private readonly logger = new Logger(PythonServiceClient.name);
  private readonly processorUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.processorUrl =
      this.configService.get<string>('PYTHON_SERVICE_URL') ||
      'http://localhost:8000';
  }

  async process(payload: ProcessorPayload): Promise<ProcessorResponse> {
    const url = `${this.processorUrl}/process`;

    try {
      this.logger.log(
        `Enviando pago al servicio de python: ${url} | $${payload.amount} ${payload.currency}`,
      );

      const response = await firstValueFrom(
        this.httpService.post<ProcessorResponse>(url, payload),
      );

      this.logger.log(
        `Respuesta servicio de python: ${response.data.approved ? 'APROBADO' : 'RECHAZADO'} | Ref: ${response.data.reference}`,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ECONNREFUSED') {
        this.logger.error(
          'Servicio Python no disponible. Verifique esté corriendo en el puerto 8000?',
        );
        throw new HttpException('Servicio de python no disponible.', 502);
      }

      if (axiosError.response) {
        this.logger.error(
          `Error del servicio de python: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`,
        );
        throw new HttpException(
          axiosError.response.data || 'Error en servicio de python',
          axiosError.response.status || 502,
        );
      }

      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error inesperado en comunicacion con servicio de python: ${error.message}`,
      );
      throw new HttpException('Error interno al procesar pago', 500);
    }
  }
}
