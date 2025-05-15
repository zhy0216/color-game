

  /**
   * Helper method to count blue pixels in a snapshot
   */
  export function countBluePixelsInSnapshot(
    snapshot: HTMLImageElement,
    targetR: number,
    targetG: number,
    targetB: number,
  ): number {
    let bluePixelCount = 0
    // Create a temporary canvas to analyze the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // console.log("######### ctx:", ctx)
    if (!ctx) return 0;
    
    // Set canvas dimensions
    canvas.width = snapshot.width;
    canvas.height = snapshot.height;
    
    // Draw snapshot to canvas
    ctx.drawImage(snapshot, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    // Count blue pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if pixel matches our blue color with some tolerance for anti-aliasing
      if (Math.abs(r - targetR) < 5 && 
          Math.abs(g - targetG) < 5 && 
          Math.abs(b - targetB) < 5) {
        bluePixelCount++;
      }

    }
    return bluePixelCount
  }