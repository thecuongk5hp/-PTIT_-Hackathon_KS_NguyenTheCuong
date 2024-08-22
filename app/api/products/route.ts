import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

const getFilePath = () => path.join(process.cwd(), "database", "products.json");

export async function GET(req: NextRequest) {
  try {
    const filePath = getFilePath();
    const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
    const { searchParams } = new URL(req.url);
    const nameCuong = searchParams.get("productName")?.toLowerCase();

    if (nameCuong) {
      const matchingProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(nameCuong)
      );
      if (matchingProducts.length === 0) {
        return NextResponse.json({ message: `Không tìm thấy sản phẩm nào với tên: ${nameCuong}` });
      }
      return NextResponse.json(matchingProducts);
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newProduct = await req.json();
    const filePath = getFilePath();
    const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);

    newProduct.id = maxId + 1;
    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products));
    return NextResponse.json({ message: "Thêm mới thành công", data: newProduct });
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi" });
  }
}
