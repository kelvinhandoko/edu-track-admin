import { useState, useCallback } from "react";

const useDisclosure = (defaultIsOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prevState) => !prevState), []);

  return { isOpen, onOpen, onClose, onToggle };
};

export default useDisclosure;
