export default function PageContainer({ title, children }) {

    return (
  
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-10">
  
        <div className="max-w-7xl mx-auto">
  
          {title && (
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              {title}
            </h1>
          )}
  
          <div className="bg-white rounded-2xl shadow-xl p-8">
  
            {children}
  
          </div>
  
        </div>
  
      </div>
  
    );
  
  }