import ToastService from "../../services/toastService/ToastService";

const CopyText = (text, field) => {
  navigator.clipboard.writeText(text).then(
    () => {
      ToastService.success(`${field} copied to the clipboard.`);
    },
    (err) => {
      ToastService.err("Could not copy text: ", err);
    }
  );

};
export default CopyText;