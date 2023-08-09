const Success = ({className, width="500px", height="500px"}) => {
    return (
        <div className={`z-50 flex flex-col justify-center items-center ${className}`}>
            <lottie-player src="https://lottie.host/03c0e33c-949e-4892-af4c-02b80ef7c5f7/ISbe7CrqOg.json" background="transparent" speed="1"  style={{"width": width, "height": height}} autoplay></lottie-player>
        </div>
    )
}

export default Success;