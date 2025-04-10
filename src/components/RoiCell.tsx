import { Link } from "react-router-dom";
import {Total, unitFormat} from '../../api'
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Tooltip } from "@mui/material";

interface RoiCellProps {
    isPercent: boolean;
    roi: number | "Upgrade" | undefined;
    allocatedCapital: number | Total;
    isTotal?: boolean;
}

const RoiCell: React.FC<RoiCellProps> = ({isPercent, roi, allocatedCapital, isTotal}) => {

    const evalWhichKindOfNumber = (roi: number | undefined) =>{
        let str = ''
        if (typeof roi === 'undefined'){
            return "Information not Available"
        } else {
            str += roi && roi > 0 ? "+" : ''
            str += unitFormat(roi, isPercent, allocatedCapital)
        }
        return str;
    }

    return (
        <>
                    {!roi
                        ? <>
                            <p style={{margin: 0}}>
                                ROI Info
                            </p>
                            <p style={{margin: 0}}>
                                Unavailable
                            </p>
                            </>
                        : <>
                            {roi !== "Upgrade"
                                ? <p className={roi && roi > 0 ? 'positive' : 'negative'} style={{fontSize: isTotal ? 25 : 15 }}>
                                    {evalWhichKindOfNumber(roi)}
                                  
                                    </p>
                                : <Tooltip title={"Upgrade to SimStock Pro"} placement="left-start">
                                    <Link className="upgradeLink" to="/profile">
                                        <LockPersonIcon/>
                                    </Link>
                                </Tooltip>
                            }
                        </>
                        
                    }
        </>
    )
}

export default RoiCell;