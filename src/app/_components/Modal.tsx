import React from "react";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="rounded-md bg-white p-6 shadow-md">
        <div className="mb-4">{message}</div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className={twMerge(
              "rounded-md px-5 py-1 font-bold",
              "bg-gray-500 text-white hover:bg-gray-600"
            )}
          >
            いいえ
          </button>
          <button
            onClick={onConfirm}
            className={twMerge(
              "rounded-md px-5 py-1 font-bold",
              "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            はい
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
