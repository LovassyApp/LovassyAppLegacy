using System;
using System.Linq;

namespace Backboard
{
    public class BlueboardUserObject
    {
        public readonly int id;
        public readonly byte[] public_key;
        public readonly string om_code_hashed;

        public BlueboardUserObject(int id, string public_key_hex, string om_code_hashed)
        {
            this.id = id;
            this.public_key = (from i in Enumerable.Range(0, public_key_hex.Length / 2) select Convert.ToByte(public_key_hex.Substring(i * 2, 2), 16)).ToArray();
            this.om_code_hashed = om_code_hashed;
        }
    }
}