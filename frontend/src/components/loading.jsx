const Loading = ({className}) => {
    return (
        <div className={`z-40 flex flex-col justify-center items-center ${className}`}>
            <lottie-player src="https://lottie.host/dc2c4121-bdcc-47f7-9788-0c3c9d579814/aEKndmhiQc.json" background="transparent" speed="1"  style={{"width": "300px", "height": "300px"}} loop autoplay></lottie-player>
            {/* <h1 className="text-2xl">Loading</h1> */}
        </div>
    )
}

export default Loading;