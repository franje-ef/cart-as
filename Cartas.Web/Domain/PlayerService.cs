using System;
using System.Web;
using Cartas.Web.Domain.Models;

namespace Cartas.Web.Domain
{
    public static class PlayerService
    {
        private const string CookieName = "Username_avatar";
        private const string CookiePlayerNameKey = "PlayerName";
        private const string CookieAvatarKey = "Avatar";
        private const string PlayerIdKey = "PlayerKey";
        
        public static HttpCookie CreatePlayerCookie(string playerName, string avatar)
        {
            var cookie = new HttpCookie(CookieName);
            cookie.Values[CookiePlayerNameKey] = HttpUtility.UrlEncode(playerName);
            cookie.Values[CookieAvatarKey] = avatar;
            cookie.Values[PlayerIdKey] = Guid.NewGuid().ToString();
            cookie.Expires = DateTime.MaxValue;

            return cookie;
        }

        public static Player GetPlayer(HttpCookieCollection cookieCollection)
        {
            var cookie = cookieCollection[CookieName];
            if (cookie == null) return null;

            return new Player
            {
                Avatar = cookie[CookieAvatarKey],
                PlayerName = HttpUtility.UrlDecode(cookie[CookiePlayerNameKey]),
                PlayerId = cookie[PlayerIdKey]
            };
        }
    }
}