export default function LeftCards() {
  return (
    <div className="relative w-[90%] max-w-[700px] h-[80vh] max-h-[800px] ml-0">
      
      {/* Back card */}
      <div className="absolute w-full h-full bg-blue-900 rounded-r-3xl -top-8 -left-8 z-0" />

      {/* Front card */}
      <div className="absolute w-full h-full bg-blue-700 rounded-r-3xl z-10" />

    </div>
  )
}