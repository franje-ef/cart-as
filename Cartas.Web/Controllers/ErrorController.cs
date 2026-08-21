using Microsoft.AspNetCore.Mvc;

namespace Cartas.Web.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}
