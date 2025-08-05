import Iconify from "@components/ui/iconify/Iconify";

export default function Loading() {
    return (
      <div className="loader">
         <Iconify icon="svg-spinners:6-dots-rotate" width={20} />
      </div>
    );
  }
  