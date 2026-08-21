using System;
using System.Text.Json;
using Cartas.Web.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Cartas.Web.Domain
{
    public static class PlayerService
    {
        private const string CookieName = "Username_avatar";

        public static void SetPlayerCookie(IResponseCookies cookies, string playerName, string avatar)
        {
            var data = new CookieData(playerName, avatar, Guid.NewGuid().ToString());

            cookies.Append(CookieName, JsonSerializer.Serialize(data), new CookieOptions
            {
                Expires = DateTimeOffset.MaxValue
            });
        }

        public static Player GetPlayer(IRequestCookieCollection cookieCollection)
        {
            if (!cookieCollection.TryGetValue(CookieName, out var raw) || string.IsNullOrEmpty(raw))
                return null;

            var data = JsonSerializer.Deserialize<CookieData>(raw);

            return new Player
            {
                Avatar = data.Avatar,
                PlayerName = data.PlayerName,
                PlayerId = data.PlayerId
            };
        }

        private record CookieData(string PlayerName, string Avatar, string PlayerId);
    }
}
