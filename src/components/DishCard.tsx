interface DishCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  tag?: string;
}

const DishCard = ({ image, name, description, price, tag }: DishCardProps) => {
  return (
    <div className="card-dish group cursor-pointer">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
        {/* Tag */}
        {tag && (
          <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
            {tag}
          </span>
        )}

        {/* Info */}
        <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
          <h3 className="font-display text-2xl mb-2 text-foreground">{name}</h3>
          <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-xl">{price}</span>
            <button className="bg-foreground/10 hover:bg-primary text-foreground text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
