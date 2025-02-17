export default function Skeleton () {
    return (
        <div className="p-4">
            <div className="flex flex-col gap-6 pb-6 overflow-x-auto md:flex-row">
                {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="w-full md:w-80 min-h-[200px] bg-white rounded-lg shadow-lg p-4 border border-gray-300 animate-pulse">
                        <div className="w-1/2 h-6 mb-3 bg-gray-300 rounded"></div>
                        <div className="flex flex-col gap-3">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-10 bg-gray-300 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

