import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Servicio de envio de emails para el sistema de hotel."""

    @staticmethod
    def is_configured() -> bool:
        """Verifica si el servicio de email esta configurado."""
        return bool(
            settings.SMTP_HOST and
            settings.SMTP_PORT and
            settings.EMAIL_FROM_ADDRESS
        )

    @staticmethod
    def _get_smtp_connection():
        """Crea conexion SMTP."""
        if settings.SMTP_USE_TLS:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)

        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

        return server

    @staticmethod
    def _get_hotel_logo_html() -> str:
        """Retorna el HTML del logo del hotel."""
        return """
        <div style="text-align: center; padding: 20px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
                        padding: 15px 30px; border-radius: 10px;">
                <h1 style="color: #ffffff; font-family: 'Georgia', serif; margin: 0;
                           font-size: 28px; letter-spacing: 2px;">
                    HOTEL KIOSK
                </h1>
                <p style="color: #e2e8f0; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 3px;">
                    PREMIUM EXPERIENCE
                </p>
            </div>
        </div>
        """

    @staticmethod
    def _get_email_template(content: str, title: str) -> str:
        """Genera template HTML base para emails."""
        logo = EmailService._get_hotel_logo_html()
        return f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                     background-color: #f7fafc;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                   style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <tr>
                    <td style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 10px;">
                        {logo}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        {content}
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f7fafc; padding: 30px; text-align: center;
                               border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                            Gracias por hospedarte con nosotros
                        </p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                            Este es un correo automatico, por favor no responder directamente.
                        </p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 10px 0 0 0;">
                            &copy; {datetime.now().year} Hotel Kiosk. Todos los derechos reservados.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Envia un email.

        Args:
            to_email: Direccion de destino
            subject: Asunto del email
            html_content: Contenido HTML
            text_content: Contenido texto plano (opcional)

        Returns:
            True si se envio exitosamente, False en caso contrario
        """
        if not EmailService.is_configured():
            logger.warning("Email service not configured. Skipping email send.")
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM_ADDRESS}>"
            msg["To"] = to_email

            if text_content:
                part1 = MIMEText(text_content, "plain")
                msg.attach(part1)

            part2 = MIMEText(html_content, "html")
            msg.attach(part2)

            server = EmailService._get_smtp_connection()
            server.sendmail(settings.EMAIL_FROM_ADDRESS, to_email, msg.as_string())
            server.quit()

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    @staticmethod
    def send_check_in_confirmation(
        guest_email: str,
        guest_name: str,
        hotel_name: str,
        room_number: str,
        digital_key_code: str,
        wristband_code: str,
        check_in_date: datetime,
        check_out_date: datetime
    ) -> bool:
        """
        Envia email de confirmacion de check-in.

        Args:
            guest_email: Email del huesped
            guest_name: Nombre completo del huesped
            hotel_name: Nombre del hotel
            room_number: Numero de habitacion
            digital_key_code: Codigo de llave digital
            wristband_code: Codigo de pulsera
            check_in_date: Fecha de entrada
            check_out_date: Fecha de salida

        Returns:
            True si se envio exitosamente, False en caso contrario
        """
        content = f"""
        <h2 style="color: #1a365d; margin: 0 0 20px 0; font-size: 24px;">
            Bienvenido, {guest_name}!
        </h2>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Tu check-in en <strong>{hotel_name}</strong> ha sido completado exitosamente.
            A continuacion encontraras los detalles de tu estadia:
        </p>

        <div style="background-color: #edf2f7; border-radius: 10px; padding: 25px; margin: 20px 0;">
            <table width="100%" cellspacing="0" cellpadding="8">
                <tr>
                    <td style="color: #718096; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                        Habitacion:
                    </td>
                    <td style="color: #1a365d; font-size: 18px; font-weight: bold;
                               border-bottom: 1px solid #e2e8f0; text-align: right;">
                        {room_number}
                    </td>
                </tr>
                <tr>
                    <td style="color: #718096; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                        Fecha de entrada:
                    </td>
                    <td style="color: #2d3748; font-size: 14px; border-bottom: 1px solid #e2e8f0;
                               text-align: right;">
                        {check_in_date.strftime('%d/%m/%Y')}
                    </td>
                </tr>
                <tr>
                    <td style="color: #718096; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                        Fecha de salida:
                    </td>
                    <td style="color: #2d3748; font-size: 14px; border-bottom: 1px solid #e2e8f0;
                               text-align: right;">
                        {check_out_date.strftime('%d/%m/%Y')}
                    </td>
                </tr>
            </table>
        </div>

        <div style="background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
                    border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center;">
            <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase;
                      letter-spacing: 1px;">
                Tu Llave Digital
            </p>
            <p style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;
                      letter-spacing: 3px; font-family: 'Courier New', monospace;">
                {digital_key_code}
            </p>
        </div>

        <div style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
                    border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center;">
            <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase;
                      letter-spacing: 1px;">
                Codigo de Pulsera
            </p>
            <p style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;
                      letter-spacing: 3px; font-family: 'Courier New', monospace;">
                {wristband_code}
            </p>
        </div>

        <div style="background-color: #fef3c7; border-left: 4px solid #d69e2e;
                    padding: 15px 20px; margin: 20px 0; border-radius: 0 10px 10px 0;">
            <p style="color: #744210; font-size: 14px; margin: 0;">
                <strong>Importante:</strong> Guarda este correo. Necesitaras tu llave digital
                para acceder a tu habitacion y las instalaciones del hotel.
            </p>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
            Si tienes alguna pregunta o necesitas asistencia, no dudes en contactar a la recepcion.
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
            Te deseamos una excelente estadia!
        </p>
        """

        html = EmailService._get_email_template(content, "Confirmacion de Check-in")

        text = f"""
        Bienvenido, {guest_name}!

        Tu check-in en {hotel_name} ha sido completado exitosamente.

        Detalles de tu estadia:
        - Habitacion: {room_number}
        - Fecha de entrada: {check_in_date.strftime('%d/%m/%Y')}
        - Fecha de salida: {check_out_date.strftime('%d/%m/%Y')}

        Tu Llave Digital: {digital_key_code}
        Codigo de Pulsera: {wristband_code}

        Guarda este correo. Necesitaras tu llave digital para acceder a tu habitacion.

        Te deseamos una excelente estadia!
        """

        return EmailService.send_email(
            to_email=guest_email,
            subject=f"Confirmacion de Check-in - {hotel_name}",
            html_content=html,
            text_content=text
        )

    @staticmethod
    def send_check_out_confirmation(
        guest_email: str,
        guest_name: str,
        hotel_name: str,
        room_number: str,
        check_in_date: datetime,
        check_out_date: datetime,
        total_nights: int
    ) -> bool:
        """
        Envia email de confirmacion de check-out.

        Args:
            guest_email: Email del huesped
            guest_name: Nombre completo del huesped
            hotel_name: Nombre del hotel
            room_number: Numero de habitacion
            check_in_date: Fecha de entrada
            check_out_date: Fecha de salida
            total_nights: Total de noches de estadia

        Returns:
            True si se envio exitosamente, False en caso contrario
        """
        content = f"""
        <h2 style="color: #1a365d; margin: 0 0 20px 0; font-size: 24px;">
            Gracias por tu visita, {guest_name}!
        </h2>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Tu check-out en <strong>{hotel_name}</strong> ha sido completado exitosamente.
            Esperamos que hayas disfrutado tu estadia con nosotros.
        </p>

        <div style="background-color: #edf2f7; border-radius: 10px; padding: 25px; margin: 20px 0;">
            <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 18px;">
                Resumen de tu Estadia
            </h3>
            <table width="100%" cellspacing="0" cellpadding="8">
                <tr>
                    <td style="color: #718096; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                        Habitacion:
                    </td>
                    <td style="color: #2d3748; font-size: 14px; border-bottom: 1px solid #e2e8f0;
                               text-align: right;">
                        {room_number}
                    </td>
                </tr>
                <tr>
                    <td style="color: #718096; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                        Fecha de entrada:
                    </td>
                    <td style="color: #2d3748; font-size: 14px; border-bottom: 1px solid #e2e8f0;
                               text-align: right;">
                        {check_in_date.strftime('%d/%m/%Y')}
                    </td>
                </tr>
                <tr>
                    <td style="color: #718096; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                        Fecha de salida:
                    </td>
                    <td style="color: #2d3748; font-size: 14px; border-bottom: 1px solid #e2e8f0;
                               text-align: right;">
                        {check_out_date.strftime('%d/%m/%Y')}
                    </td>
                </tr>
                <tr>
                    <td style="color: #718096; font-size: 14px;">
                        Total de noches:
                    </td>
                    <td style="color: #1a365d; font-size: 16px; font-weight: bold; text-align: right;">
                        {total_nights}
                    </td>
                </tr>
            </table>
        </div>

        <div style="background: linear-gradient(135deg, #805ad5 0%, #6b46c1 100%);
                    border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center;">
            <p style="color: #ffffff; font-size: 18px; margin: 0 0 10px 0;">
                Esperamos verte pronto!
            </p>
            <p style="color: #e9d8fd; font-size: 14px; margin: 0;">
                Tu opinion es muy importante para nosotros
            </p>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
            Si tuviste una buena experiencia, te agradeceríamos que nos dejaras una resena.
            Tus comentarios nos ayudan a mejorar nuestro servicio.
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
            Hasta pronto!
        </p>
        """

        html = EmailService._get_email_template(content, "Confirmacion de Check-out")

        text = f"""
        Gracias por tu visita, {guest_name}!

        Tu check-out en {hotel_name} ha sido completado exitosamente.

        Resumen de tu Estadia:
        - Habitacion: {room_number}
        - Fecha de entrada: {check_in_date.strftime('%d/%m/%Y')}
        - Fecha de salida: {check_out_date.strftime('%d/%m/%Y')}
        - Total de noches: {total_nights}

        Esperamos verte pronto!

        Hasta pronto!
        """

        return EmailService.send_email(
            to_email=guest_email,
            subject=f"Gracias por tu visita - {hotel_name}",
            html_content=html,
            text_content=text
        )
