using System.Collections.Generic;

namespace Backboard
{
    public class BlueboardUsersResponse
    {
        public readonly string status;
        public readonly string message;
        public readonly List<BlueboardUserObject> data;

        public BlueboardUsersResponse(string status, string message, List<BlueboardUserObject> data)
        {
            this.status = status;
            this.message = message;
            this.data = data;
        }
    }
}