from PIL import Image
import os
import glob

def make_transparent(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()

    # Get the background color from the top-left corner
    bg_color = data[0]

    # Threshold for color distance
    threshold = 30

    new_data = []
    for item in data:
        # Calculate distance
        if abs(item[0] - bg_color[0]) < threshold and \
           abs(item[1] - bg_color[1]) < threshold and \
           abs(item[2] - bg_color[2]) < threshold:
            # Make transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    # Crop to bounding box (removes transparent margins)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(out_path, "PNG")

if __name__ == "__main__":
    folder = r"c:\Users\yuvra\OneDrive\Desktop\Stoneo\frontend\public\logos"
    files = glob.glob(os.path.join(folder, "*.PNG"))
    
    for file in files:
        if "transparent" not in file:
            filename = os.path.basename(file)
            name, ext = os.path.splitext(filename)
            out_name = f"{name}_transparent.png"
            out_path = os.path.join(folder, out_name)
            make_transparent(file, out_path)
            print(f"Saved {out_name}")
