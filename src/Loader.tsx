import './Loader.css'

export const Loader = ({ text } : { text?: string }) => {
    return <> <div className='loader'>
    </div>
        <span>{text}</span>
    </>
}

export default Loader;