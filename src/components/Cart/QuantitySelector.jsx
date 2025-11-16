import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";

function QuantitySelector({ quantity, setQuantity }) {
  const plusQuantity = () => {
    setQuantity(quantity + 1);
  };
  const minusQuantity = () => {
    setQuantity(quantity - 1);
  };
  const editQuantity = (e) => {
    setQuantity(parseInt(e.target.value));
  };
  return (
    <div className="flex w-full justify-between items-center md:space-x-1">
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        onClick={minusQuantity}
        disabled={quantity === 1}
      >
        <Minus />
      </Button>
      <Input
        className="text-[0.8rem] p-0 text-center min-w-8"
        value={quantity}
        onChange={editQuantity}
        type="number"
        min={1}
      />
      <Button variant={"ghost"} size={"icon-sm"} onClick={plusQuantity}>
        <Plus />
      </Button>
    </div>
  );
}

export default QuantitySelector;
