import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const generatePDF = async (html, filename) => {
  try {
    const { uri } = await Print.printToFileAsync({
      html,
      width: 612,
      height: 792,
      base64: false
    });

    const newPath = `${FileSystem.documentDirectory}${filename}.pdf`;
    await FileSystem.copyAsync({ from: uri, to: newPath });

    return {
      success: true,
      filePath: newPath,
      shareableUri: uri
    };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return { success: false, error };
  }
};

export const sharePDF = async (filePath) => {
  if (!(await Sharing.isAvailableAsync())) {
    alert('Sharing is not available on this device');
    return;
  }
  
  await Sharing.shareAsync(filePath, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share Report',
    UTI: 'com.adobe.pdf'
  });
};

export const printPDF = async (filePath) => {
  await Print.printAsync({ uri: filePath });
};