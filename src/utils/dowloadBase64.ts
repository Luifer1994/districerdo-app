/**
 * Descarga un archivo desde una cadena base64.
 * @param base64 La cadena de base64 del archivo.
 * @param format El formato del archivo (por ejemplo, 'png', 'jpg', 'pdf', etc.).
 * @param fileName El nombre que deseas darle al archivo, incluyendo la extensión.
 */
export const downloadBase64File = (base64String, format, fileName) => {
    // Verifica los parámetros de entrada
    if (!base64String || !format || !fileName) {
      console.error("Parámetros inválidos.");
      return;
    }
  
    // Convierte la cadena base64 a un Uint8Array directamente
    const byteArray = Uint8Array.from(atob(base64String), char => char.charCodeAt(0));
  
    // Crea el blob y el enlace de descarga
    const blob = new Blob([byteArray], { type: `application/${format}` });
    const downloadUrl = URL.createObjectURL(blob);
    
    // Crea el enlace de descarga
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = fileName;
  
    // Agrega el enlace al cuerpo del documento y simula un clic para descargar el archivo
    document.body.appendChild(anchor);
    anchor.click();
  
    // Limpia el enlace y el objeto URL
    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(anchor);
  };
