using System.IO;
using System.Linq;
using Cartas.Web.Domain;
using Cartas.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Cartas.Web.Controllers
{
    public class PlayerController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public PlayerController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public ActionResult Register()
        {
            var model = new RegisterPlayerViewModel();
            model.AvatarList = Directory.GetFiles(Path.Combine(_env.WebRootPath, "Content", "img", "avatars"))
                .Select(Path.GetFileName)
                .ToList();

            return View(model);
        }

        [HttpPost]
        public ActionResult Register(RegisterPlayerViewModel model)
        {
            PlayerService.SetPlayerCookie(Response.Cookies, model.Name, model.Avatar);

            return RedirectToAction("Index", "Game");
        }
    }
}
