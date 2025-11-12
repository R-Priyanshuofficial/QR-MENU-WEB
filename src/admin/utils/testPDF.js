// Simple test to verify PDF generation works
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const testPDFGeneration = () => {
  try {
    console.log('Testing PDF generation...');
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Test PDF', 15, 15);
    
    autoTable(doc, {
      startY: 30,
      head: [['Column 1', 'Column 2']],
      body: [
        ['Data 1', 'Data 2'],
        ['Data 3', 'Data 4']
      ]
    });
    
    doc.save('test.pdf');
    console.log('✅ PDF generated successfully!');
    return true;
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    return false;
  }
};
