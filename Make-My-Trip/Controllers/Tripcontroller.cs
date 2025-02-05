using Microsoft.AspNetCore.Mvc;
using Make_My_Trip.Models;

namespace Make_My_Trip.Controllers
{
    public class TripController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Calculate(Trip trip)
        {
            // Simulate data as Google Maps integration will require API keys and AJAX
            if (trip.Locations.Count < 2)
            {
                ViewBag.Error = "Please select at least two locations.";
                return View("Index");
            }

            // Placeholder logic for demo purposes
            trip.Distance = 150.0; // Example distance
            trip.Duration = 2.5; // Example duration
            trip.FuelCost = (trip.Distance / trip.FuelEfficiency) * trip.FuelPrice;

            return View("Result", trip);
        }
    }
}