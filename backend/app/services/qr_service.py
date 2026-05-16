import qrcode
import io
import base64
from typing import Optional


class QRService:
    @staticmethod
    def generate_qr_code(data: str, size: int = 10) -> str:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=size,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_base64}"

    @staticmethod
    def generate_check_in_qr(qr_code: str, hotel_id: int) -> str:
        data = f"HOTEL:{hotel_id}|QR:{qr_code}"
        return QRService.generate_qr_code(data)
