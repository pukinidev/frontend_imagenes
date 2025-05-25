import MenuBar from "@/components/menubar";
import ImageAnalysisInterface from "../components/image-analysis-interface";


export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MenuBar />
      <ImageAnalysisInterface />
    </div>
  )
}
