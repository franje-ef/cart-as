namespace Cartas.Web.Domain.Models
{
    public class Card
    {
        public int Num { get; set; }
        public int Suit { get; set; }

        public Card(int num, int suit)
        {
            Num = num;
            Suit = suit;
        }

        protected bool Equals(Card other)
        {
            return Num == other.Num && Suit == other.Suit;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((Card)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (Num * 397) ^ Suit;
            }
        }

        public static bool operator ==(Card left, Card right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(Card left, Card right)
        {
            return !Equals(left, right);
        }
    }
}