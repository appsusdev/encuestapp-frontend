import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async (
  componentRef: React.MutableRefObject<HTMLDivElement>,
  name: string
) => {
  await html2canvas(componentRef.current, {
    allowTaint: false,
    useCORS: true,
    proxy: "/",
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    const doc = new jsPDF("p", "mm");
    let position = 0;

    doc.addImage(imgData, "jpeg", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "jpeg", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(`${name}.pdf`);
  });
};
