import React from "react";

interface ValidationAlertProps {
  msg: string;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ msg }) => {
  if (!msg) return null;

  return <div className="text-red-500">{msg}</div>;
};

export default ValidationAlert;
