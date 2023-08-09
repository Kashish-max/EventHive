import { useDispatch } from "react-redux";
import { setSearch } from "../store/authSlice";

export default function Search({inputClass}) {
    const dispatch = useDispatch();

    const handleChange = (e) => {
        e.preventDefault();
        dispatch(setSearch(e.target.value.toLowerCase()))
    }

    return (
        <form className="relative flex">
            <input 
                className={`h-min ${inputClass}`} 
                placeholder="Search Opportunities"
                onChange={handleChange}
            />
            <button type="submit" className="absolute bottom-1/2 right-3 translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 172 172" className="fill-black">
                    <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode": "normal"}}>
                        <path d="M0,172v-172h172v172z" fill="none"></path>
                        <g className="fill-black">
                            <path d="M64.5,14.33333c-27.6214,0 -50.16667,22.54527 -50.16667,50.16667c0,27.6214 22.54527,50.16667 50.16667,50.16667c12.52732,0 23.97256,-4.67249 32.7819,-12.31771l3.05143,3.05143v9.26628l40.03256,40.03256c3.95599,3.95599 10.37733,3.956 14.33333,0c3.956,-3.956 3.956,-10.37733 0,-14.33333l-40.03256,-40.03256h-9.26628l-3.05143,-3.05143c7.64521,-8.80934 12.31771,-20.25458 12.31771,-32.7819c0,-27.6214 -22.54527,-50.16667 -50.16667,-50.16667zM64.5,28.66667c19.87509,0 35.83333,15.95824 35.83333,35.83333c0,19.87509 -15.95825,35.83333 -35.83333,35.83333c-19.87509,0 -35.83333,-15.95825 -35.83333,-35.83333c0,-19.87509 15.95824,-35.83333 35.83333,-35.83333z"></path>
                        </g>
                    </g>
                </svg>
            </button>
        </form>
    )
  }
  