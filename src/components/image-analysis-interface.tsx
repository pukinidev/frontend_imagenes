"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileImage, AlertTriangle, Download, RotateCcw } from "lucide-react"

export default function ImageAnalysisInterface() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setUploadedImage(result)
          setShowResults(false)
          // Simulate analysis
          setIsAnalyzing(true)
          setTimeout(() => {
            setIsAnalyzing(false)
            setShowResults(true)
          }, 3000)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setShowResults(false)
        setIsAnalyzing(true)
        setTimeout(() => {
          setIsAnalyzing(false)
          setShowResults(true)
        }, 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetAnalysis = () => {
    setUploadedImage(null)
    setShowResults(false)
    setIsAnalyzing(false)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Upload Area */}
      {!uploadedImage && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-12">
            <div className="text-center space-y-4" onDragOver={handleDragOver} onDrop={handleDrop}>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload Skin Lesion Image</h3>
                <p className="text-gray-600 mt-2">Drag and drop an image here, or click to select</p>
                <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, TIFF formats • Max 10MB</p>
              </div>
              <div>
                <Button asChild className="cursor-pointer">
                  <label htmlFor="image-upload">
                    <FileImage className="h-4 w-4 mr-2" />
                    Select Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                  </label>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <h3 className="text-lg font-semibold">Analyzing Image...</h3>
              <p className="text-gray-600">AI is processing the skin lesion for melanoma detection</p>
              <Progress value={75} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {uploadedImage && showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Original Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Original Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Original skin lesion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Resolution:</strong> 1024x768 px
                </p>
                <p>
                  <strong>File Size:</strong> 2.3 MB
                </p>
                <p>
                  <strong>Format:</strong> JPEG
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Segmentation Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Lesion Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Segmented lesion"
                  className="w-full h-full object-cover"
                />
                {/* Overlay to simulate segmentation */}
                <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 border-2 border-red-500 rounded-full bg-red-500 bg-opacity-30"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Classification */}
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Badge variant="destructive" className="mb-2">
                  SUSPICIOUS
                </Badge>
                <p className="text-lg font-semibold text-orange-800">Possible Melanoma</p>
                <p className="text-sm text-orange-600 mt-1">Confidence: 78.3%</p>
              </div>

              {/* Risk Assessment */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Melanoma Risk:</span>
                    <span className="font-medium text-red-600">High</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Benign Probability:</span>
                    <span className="font-medium">21.7%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Export Report
                </Button>
                <Button size="sm" variant="outline" onClick={resetAnalysis}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
