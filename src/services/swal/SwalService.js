import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./SwalService.scss";
// import { AppIcons } from "../../data/appIcons";

export const SwalServices = withReactContent(Swal);

const customClass = {
  container: "",
  popup: "",
  header: "",
  title: "",
  closeButton: "",
  icon: "",
  image: "",
  htmlContainer: "",
  input: "",
  inputLabel: "",
  validationMessage: "",
  actions: "",
  confirmButton: "btn theme-button",
  denyButton: "btn theme-button",
  cancelButton: "btn dark-btn",
  loader: "",
  footer: "",
  timerProgressBar: "",
};
const SwalAlert = () => {
  const success = (text, title) => {
    return SwalServices.fire({
      title: title,
      text: text,
      icon: "success",
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });
  };

  const error = (text, title) => {
    return SwalServices.fire({
      title: title,
      text: text,
      icon: "error",
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });
  };

  const warning = (title, text) => {
    return SwalServices.fire({
      position: "top-end",
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });
  };

  const toast = (icon, title = 'Notification') => {
    return SwalServices.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  const info = (title, text) => {
    return SwalServices.fire({
      title: title,
      text: text,
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });
  };

  const confirm = (
    title,
    text,
    saveBtnText,
    cancelBtnText,
    isCancelButton,
    thirdBtnText,
    validationMessage,
    validateCallback,
    placeholderText,
    includeTextarea = false,
  ) => {
    const textareaHtml = includeTextarea ? `
      <textarea id="swal-textarea" class="swal-textarea" placeholder="${placeholderText}" style="width:100%; height:100px; margin-top:10px;"></textarea>
      <div id="validation-message" class="swal-validation-error" style="display: none;">${validationMessage}</div>
    ` : '';

    return SwalServices.fire({
      title: title,
      html: `
        <p>${text}</p>
        ${textareaHtml}
      `,
      icon: "question",
      showCancelButton: isCancelButton === false ? isCancelButton : true,
      confirmButtonText: saveBtnText,
      cancelButtonText: cancelBtnText,
      showDenyButton: !!thirdBtnText,
      denyButtonText: thirdBtnText || "",
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: customClass,
      preConfirm: () => {
        if (includeTextarea) {
          const textareaValue = document.getElementById("swal-textarea").value.trim();

          const isValid = validateCallback(textareaValue);
          if (!isValid) {
            document.getElementById("validation-message").style.display = "block";
            return false;
          }
          return textareaValue;
        }
        return true;
      }
    }).then((result) => {
      if (result.dismiss === SwalServices.DismissReason.cancel) {
        return false;
      }

      if (result.isDenied) {
        return "third"; // <-- Return something identifiable for the third button
      }

      if (result.value) {
        return result.value;
      }

      return false;
    });
  };


  const blocked = (title, text, iconUrl) => {
    return SwalServices.fire({
      title: title,
      text: text,
      // iconHtml: `<img src="${AppIcons.BlockedIcon}" class="swal-icon"/>`,
      iconHtml: `<img src="${AppIcons.BlockedIcon}" class="swal-icon"/>`,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: customClass,
    });
  };

  const topCenterAutoCloser = (title, text) => {
    let timerInterval;
    SwalServices.fire({
      title: title,
      text: text,
      timer: 2000,
      timerProgressBar: true,
      position: "top",
      showConfirmButton: false,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInLeft
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutRight
          animate__faster
        `
      },
      didOpen: () => {
        const timer = SwalServices.getPopup().querySelector("b");
        if (timer) {
          timerInterval = setInterval(() => {
            timer.textContent = `${SwalServices.getTimerLeft()}`;
          }, 100);
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  };

  const confirmWithThreeButtons = (
    title,
    text,
    saveBtnText,
    secondBtnText,
    cancelBtnText,
    includeTextarea = false,
    validateCallback = () => true,
    validationMessage = "Please fill the required field.",
    placeholderText = "Enter details here..."
  ) => {
    const textareaHtml = includeTextarea
      ? `
        <textarea id="swal-textarea" placeholder="${placeholderText}" class="swal2-textarea"></textarea>
        <div id="validation-message" style="color:red;display:none;">${validationMessage}</div>
      `
      : "";

    return SwalServices.fire({
      title: title,
      html: `
      <p style="margin-bottom: 20px; font-size: 16px;">${text}</p>
      ${textareaHtml}
      <div style="display: flex; justify-content: center; gap: 12px; margin-top: 25px;">
        <button id="swal-create" class="swal2-confirm swal2-styled"
          style="background-color: #7B61FF; color: white; padding: 10px 18px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-weight: 500;">
          <span style="background: #00BFFF; border-radius: 4px; padding: 2px 6px; font-size: 11px; color: white;">NEW</span>
          ${saveBtnText}
        </button>

        <button id="swal-existing" class="swal2-confirm swal2-styled"
          style="background-color: #F7B731; color: white; padding: 10px 18px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-weight: 500;">
          <img src="https://cdn-icons-png.flaticon.com/512/679/679720.png" alt="box" width="18" height="18" style="margin-bottom: 2px;" />
          ${secondBtnText}
        </button>

        <button id="swal-cancel" class="swal2-cancel swal2-styled"
          style="background-color: #2D2D2D; color: white; padding: 10px 18px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-weight: 500;">
          <span style="font-size: 16px;">❌</span> ${cancelBtnText}
        </button>
      </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      willOpen: () => {
        const createBtn = SwalServices.getPopup().querySelector('#swal-create');
        const existingBtn = SwalServices.getPopup().querySelector('#swal-existing');
        const cancelBtn = SwalServices.getPopup().querySelector('#swal-cancel');

        createBtn.addEventListener('click', () => {
          if (includeTextarea) {
            const textareaValue = document.getElementById("swal-textarea").value.trim();
            const isValid = validateCallback(textareaValue);
            if (!isValid) {
              document.getElementById("validation-message").style.display = "block";
              return;
            }
            SwalServices.close({ is: 'create', value: textareaValue });
          } else {
            SwalServices.close({ is: 'create' });
          }
        });

        existingBtn.addEventListener('click', () => {
          SwalServices.close({ is: 'existing' });
        });

        cancelBtn.addEventListener('click', () => {
          SwalServices.close(); // No return; modal just closes
        });
      }
    }).then((result) => {
      return result.value; // undefined if user clicked Cancel
    });
  };




  // Export the SwalService functions
  return { confirm, success, warning, info, error, toast, blocked, topCenterAutoCloser, confirmWithThreeButtons };
};

export default SwalAlert;
