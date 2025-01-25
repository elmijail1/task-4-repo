export default function ToolBarButton({ children, classNameValue, titleValue, onClickAction }) {
    return (
        <button
            className={classNameValue}
            title={titleValue}
            onClick={onClickAction}
        >
            {children}
        </button>
    )
}