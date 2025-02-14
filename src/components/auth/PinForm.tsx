import React, { useState } from "react";
import { FormControl, Input} from "@mui/material";

interface PinNum {
    id: "first" | "second" | "third" | "fourth";
    index: number;
    isLast?: boolean;
}
const pinNums: PinNum[] = [
    {
        id: "first", 
        index: 0
    },
    {
        id: "second", 
        index: 1
    },
    {
        id: "third", 
        index: 2
    },
    {
        id: "fourth", 
        index: 3,
        isLast: true
    },
]

let filledMap = new Map<number, boolean>([
    [0, false],
    [1, false],
    [2, false],
    [3, false],
  ]);

interface PinFormProps {
    handleValidatePin: ()=>void;
}

const PinForm: React.FC<PinFormProps> = ({handleValidatePin}) => {
  const [formData, setFormData] = useState({ first: "", second: "", third: "", fourth: ""});
  const [isFilledMap, setIsFilledMap] = useState(filledMap)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value)){
        let item = pinNums.find((x: PinNum)=> x.id === e.target.name) as PinNum;
        let filled = new Map(isFilledMap)
        filled.set(item.index, true);
        let nextItem = pinNums[item.index + 1]
        let name = nextItem ? nextItem.id : null
        setIsFilledMap(filled);
        setFormData({ ...formData, [e.target.name]: e.target.value });
        const allTrue = [...filled.values()].every(value => value === true);
        if (name){
            const nextfield = document.querySelector(
                `input[name=${name}]`
            ) as HTMLInputElement;
            setTimeout(()=>{
                if (nextfield !== null) {
                    nextfield.focus();
                }
            }, 100)
        }
        if (allTrue){
            handleValidatePin()
            // TO DO: Add API request for validating the PIN.
        }
    }
  };

  const checkDisabled = (num: PinNum) =>{
    let { index } = num
    if (index === 0){
        return isFilledMap.get(index)
    } else if (isFilledMap.get(index-1) !== true ||isFilledMap.get(index) ){
        return true
    } else {
        return false
    }
  }

  return (
    <>
    <h4>If there is an account connected to your email address, you will receive a four digit. Enter that pin below to verify your account.</h4>
    <form>
        {pinNums.map((num: PinNum)=>{
            let {id} = num;
            return  <input key={id} className="pinFormItem" autoFocus name={id} id={id} value={formData[id]} onChange={handleChange} disabled={checkDisabled(num)}/>
        })}
    </form>
    </>
  );
};

export default PinForm;