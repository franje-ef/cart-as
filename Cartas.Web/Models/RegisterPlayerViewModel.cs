﻿using System.Collections.Generic;

namespace Cartas.Web.Models
{
    public class RegisterPlayerViewModel
    {
        public string Name { get; set; }
        public string Avatar { get; set; }
        public List<string> AvatarList { get; set; }
    }
}