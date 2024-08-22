import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

const getFilePath = () => path.join(process.cwd(), "database", "products.json");

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const filePath = getFilePath();
    const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
    const product = products.find((product) => product.id === +params.id);
    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi" });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedProduct = await req.json();
    const filePath = getFilePath();
    const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
    const index = products.findIndex((product) => product.id === +params.id);

    if (index !== -1) {
      products[index] = updatedProduct;
      fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
      return NextResponse.json({ message: "Cập nhật thành công", data: updatedProduct });
    } else {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm cần cập nhật" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi" });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const filePath = getFilePath();
    const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
    const newProducts = products.filter((product) => product.id !== +params.id);

    if (newProducts.length !== products.length) {
      fs.writeFileSync(filePath, JSON.stringify(newProducts), "utf8");
      return NextResponse.json({ message: "Xóa thành công", data: newProducts });
    } else {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm cần xóa" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi" });
  }
}
