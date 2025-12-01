// src/utils/downloadImage.ts

export const downloadImage = async (
  imagePath: string,
  day: number
): Promise<void> => {
  try {
    // Fetch the image
    const response = await fetch(imagePath);
    const blob = await response.blob();

    // Create a temporary URL
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = `ramadan-day-${day}.jpg`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
    // Fallback method
    const link = document.createElement("a");
    link.href = imagePath;
    link.download = `ramadan-day-${day}.jpg`;
    link.click();
  }
};
