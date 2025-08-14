const AddToCartButton = ({
  stock,
  isLoading,
  selectedVariant,
  handleAddToCart,
}) => {
  const isDisabled = !stock || isLoading || !selectedVariant;

  const buttonText = isLoading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Adding to Cart...
    </div>
  ) : stock > 0 && selectedVariant ? (
    "Add to Cart"
  ) : (
    "Select a Variant"
  );

  return (
    <button
      disabled={isDisabled}
      onClick={handleAddToCart}
      className={[
        "w-full py-4 text-base font-semibold rounded-xl transition-all duration-300 border-2 border-indigo-600",
        isDisabled
          ? "cursor-not-allowed opacity-60"
          : "hover:bg-indigo-600 hover:text-white",
      ].join(" ")}
    >
      {buttonText}
    </button>
  );
};

export default AddToCartButton;
