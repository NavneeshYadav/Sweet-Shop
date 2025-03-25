interface ButtonProps {
    label: string;
}

function SubmitButton({ label }: ButtonProps) {
    return (
        <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition"
        >
            {label}
        </button>
    );
}

export default SubmitButton;
