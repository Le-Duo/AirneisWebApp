import { Product } from "../types/Product";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useContext } from "react";
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { ConvertProductToCartItem } from "../utils";
import { toast } from "react-toastify";

function ProductItem({ product, stockQuantity }: { product: Product; stockQuantity?: number }) {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const actualStock = stockQuantity !== undefined ? stockQuantity : product.stock;

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (actualStock && actualStock < quantity) {
      alert("Sorry, product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    toast.success("Product added to cart");
  };

  return (
    <Card style={{ cursor: "pointer" }}>
      <Link to={`/product/${product.slug}`}>
        <Card.Img
          variant="top"
          src={product.URLimages[0] || "/images/no-image.png"}
          alt={product.name}
          style={{
            filter:
              actualStock === 0
                ? "brightness(50%) saturate(100%) sepia(100%) hue-rotate(200deg)"
                : "none",
          }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Card.Text>£{product.price}</Card.Text>
        {actualStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => addToCartHandler(ConvertProductToCartItem(product))}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default ProductItem;
