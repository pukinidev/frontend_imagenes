"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileImage,
  AlertTriangle,
  Download,
  RotateCcw,
} from "lucide-react";
import { UUID } from "crypto";

interface ImageAnalysisResults {
  segmentation_id: UUID;
  mel: number;
}

export default function ImageAnalysisInterface() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] =
    useState<ImageAnalysisResults | null>(null);
  const [segmentationImage, setSegmentationImage] = useState<string | null>(
    null
  );

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file?.type?.startsWith("image/")) {
      const formData = new FormData();
      formData.append("file", file);
      setIsAnalyzing(true);
      setShowResults(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedImage(result);
        }
      };
      reader.readAsDataURL(file);
      try {
        const response = await fetch(
          "https://backend-imagenes-562367180789.us-south1.run.app/images/prediction/",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setAnalysisResults(data);
        await getImageSegmentation(data.segmentation_id);
        setIsAnalyzing(false);
        setShowResults(true);
      } catch (error) {
        console.error("Upload failed:", error);
        setIsAnalyzing(false);
      }
    }
  };

  const getImageSegmentation = async (image_prediction_id: UUID) => {
    try {
      const response = await fetch(
        `https://backend-imagenes-562367180789.us-south1.run.app/images/prediction/${image_prediction_id}?image_prediction_id=${image_prediction_id}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const blob = await response.blob();
      const data = URL.createObjectURL(blob);
      setSegmentationImage(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch segmentation:", error);
      return null;
    }
  };

  const handleDownloadSegmentation = () => {
    if (segmentationImage) {
      const link = document.createElement("a");
      link.href = segmentationImage;
      link.download = "segmentation_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setShowResults(false);
    setIsAnalyzing(false);
    setAnalysisResults(null);
    setSegmentationImage(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {!uploadedImage && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12">
            <div className="text-center space-y-4" onDragOver={handleDragOver}>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Skin Lesion Image
                </h3>
                <p className="text-gray-600 mt-2">Click to select an image</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports JPG, PNG, TIFF formats • Max 10MB
                </p>
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

      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <h3 className="text-lg font-semibold">Analyzing Image...</h3>
              <p className="text-gray-600">
                Processing the skin lesion for melanoma detection
              </p>
              <Progress value={75} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {uploadedImage && showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            </CardContent>
          </Card>

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
                  src={segmentationImage ?? "/placeholder.svg"}
                  alt="Segmented lesion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2 justify-center flex items-center">
                <Button size="sm" onClick={handleDownloadSegmentation}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Segmentation
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <Badge variant="secondary" className="mb-2 font-bold">
                  MELANOMA PROBABILITY
                </Badge>
                <p className="text-sm text-gray-700">
                  <span className="text-gray-900">{analysisResults?.mel}</span>
                </p>
              </div>
              <div className="flex gap-1 justify-center items-center">
                <Button size="sm" onClick={resetAnalysis}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
