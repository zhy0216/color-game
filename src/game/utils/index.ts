

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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    
    canvas.width = snapshot.width;
    canvas.height = snapshot.height;
    
    ctx.drawImage(snapshot, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (Math.abs(r - targetR) < 5 && 
          Math.abs(g - targetG) < 5 && 
          Math.abs(b - targetB) < 5) {
        bluePixelCount++;
      }

    }
    return bluePixelCount
  }

  export function delay(msecond: number) {
    return new Promise((r) => {
      setTimeout(r, msecond)
    })
  }