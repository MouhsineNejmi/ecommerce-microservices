interface ErrorDisplayProps {
  message: string | null;
  reset: () => void;
}

export const ErrorDisplay = ({ message, reset }: ErrorDisplayProps) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-2xl text-red-500 font-bold'>{message}</h2>
      <button
        className='mt-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600'
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
};
