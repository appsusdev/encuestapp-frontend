// @ts-ignore
import html2pdf from "html2pdf.js";

export const downloadPDF = async (
  componentRef: React.MutableRefObject<HTMLDivElement>,
  name: string
) => {
  const element = componentRef.current;
  const opt = {
    filename: `${name}.pdf`,
    margin: [0.3, 0, 0.1, 0],
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: {
      scale: 2,
      allowTaint: false,
      useCORS: true,
      proxy: "/",
    },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css"] },
  };

  await html2pdf().set(opt).from(element).save();
};
