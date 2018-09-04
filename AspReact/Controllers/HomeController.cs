using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using AspReact.Configuration;

namespace AspReact.Controllers
{
    public class HomeController : Controller
    {
        public HomeController(IConfiguration configuration)
        {
            var settingsSection = configuration.GetSection("API");
            var settings = settingsSection.Get<APISetting>();
            Debug.WriteLine(settings.BaseUrl);
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
