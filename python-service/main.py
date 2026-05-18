"""
Servicio de Procesamiento de Pagos - Python (FastAPI)
Simulando aprobacion/rechazo de pagos con probabilidad 80/20.
"""
import os
import random
import logging
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, condecimal
from fastapi.middleware.cors import CORSMiddleware

# Configuracion de logging estructurado
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Configuracion de la app
# ------------------------------------------------------------------
app = FastAPI(
    title="Servicio de Procesamiento de Pagos",
    description="Microservicio que simula el procesamiento de pagos",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tasa de aprobacion configurable via env var (default 80%)
APPROVAL_RATE = float(os.getenv("APPROVAL_RATE", "0.80"))

# ------------------------------------------------------------------
# Modelos Pydantic
# ------------------------------------------------------------------
class PaymentRequest(BaseModel):
    """Payload recibido desde el API de Node.js"""
    amount: condecimal(gt=0, max_digits=12, decimal_places=2)
    currency: str = Field(default="USD", pattern="^[A-Z]{3}$")
    card_last_four: str = Field(..., min_length=4, max_length=4)
    description: Optional[str] = Field(default=None, max_length=255)

class PaymentResponse(BaseModel):
    """Respuesta del procesador al API de Node.js"""
    approved: bool
    timestamp: str
    rejection_reason: Optional[str] = None
    processor_message: str

# ------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    """Endpoint de health check para orquestadores (Docker, K8s)."""
    return {"status": "ok", "service": "python-service", "approval_rate": APPROVAL_RATE}

@app.post("/process", response_model=PaymentResponse, status_code=status.HTTP_200_OK, tags=["Payments"])
async def process_payment(payload: PaymentRequest):
    """
    Procesa un pago simulado.

    Logica de negocio:
    - 80% probabilidad de aprobacion.
    - 20% probabilidad de rechazo con razon aleatoria.
    """
    # Simulacion de latencia de red/procesamiento bancario
    # En produccion real esto seria una llamada a una pasarela real

    is_approved = random.random() < APPROVAL_RATE

    if is_approved:
        logger.info(f"[APPROVED] Amount: {payload.amount} {payload.currency} | Card: ****{payload.card_last_four}")
        return PaymentResponse(
            approved=True,
            timestamp=datetime.utcnow().isoformat(),
            processor_message="Transacci�n aprobada por el banco emisor."
        )
    else:
        rejection_reasons = [
            "Fondos insuficientes",
            "Tarjeta declinada por banco emisor",
            "Error de comunicacion con pasarela",
            "Limite de credito excedido",
            "Transaccion sospechosa - requiere verificacion",
        ]
        reason = random.choice(rejection_reasons)
        logger.warning(f"[REJECTED] Reason: {reason} | Amount: {payload.amount} {payload.currency}")
        return PaymentResponse(
            approved=False,
            timestamp=datetime.utcnow().isoformat(),
            rejection_reason=reason,
            processor_message="Transaccion rechazada."
        )

# ------------------------------------------------------------------
# Entrypoint
# ------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False, log_level="info")