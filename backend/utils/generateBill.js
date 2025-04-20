import PDFDocument from "pdfkit";

export const generateBill = (order, res) => {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="bill-${order._id}.pdf"`);

    doc.pipe(res);

    doc.fontSize(20).text("Hospital Food Bill", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Patient: ${order.user.name}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toDateString()}`);
    doc.moveDown();

    doc.text("Items:");
    doc.moveDown();

    order.items.forEach((item, index) => {
        const name = item.name || "Unknown Item";
        const quantity = item.quantity;
        const price = item.price;

        doc.text(`${index + 1}. ${name} - Qty: ${quantity} - Rs${price}`);
    });

    doc.moveDown();
    doc.text(`Total: Rs${order.totalPrice}`, { align: "right" });
    doc.end();
};
