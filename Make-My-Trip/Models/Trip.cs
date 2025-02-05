namespace Make_My_Trip.Models
{
    public class Trip
    {
        public List<string> Locations { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
        public double FuelCost { get; set; }
        public double FuelEfficiency { get; set; }
        public double FuelPrice { get; set; }
    }
}
