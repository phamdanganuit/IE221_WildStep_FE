import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";

function QuantitySelector({ quantity, setQuantity, max }) {
  const plusQuantity = () => {
    const newQuantity = quantity + 1;
    if (!max || newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };
  const minusQuantity = () => {
    setQuantity(quantity - 1);
  };
  const editQuantity = (e) => {
    let newQuantity = parseInt(e.target.value) || 1;
    if (max && newQuantity > max) {
      newQuantity = max;
    }
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
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
        max={max}
      />
      <Button 
        variant={"ghost"} 
        size={"icon-sm"} 
        onClick={plusQuantity}
        disabled={max && quantity >= max}
      >
        <Plus />
      </Button>
    </div>
  );
}

export default QuantitySelector;
